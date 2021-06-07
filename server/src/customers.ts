import { stripe } from './';
import { db } from './firebase';
import Stripe from 'stripe';

/**
 * Creates a SetupIntent used to save a credit card for later use
 */
export async function createSetupIntent(userId: string) {

    const customer = await getOrCreateCustomer(userId);

    return stripe.setupIntents.create({
        customer: customer.id,
    })
}

/**
 * Returns all payment sources associated to the user
 */
export async function listPaymentMethods(userId: string) {
    const customer = await getOrCreateCustomer(userId);

    return stripe.paymentMethods.list({
        customer: customer.id,
        type: 'card',
    });
}
/**
 * Removes attached card from a user payment source
 */
export async function deleteCard(userId: string, cardId: string, params?: Stripe.CustomersResource) {
    const customer = await getOrCreateCustomer(userId);
    const deleted = await stripe.customers.deleteSource(
        customer.id, cardId,
    )
    return deleted;
}


/**
 * Detaches a payment sources associated to the user
 */
 export async function detachePaymentMethod(userId:string, paymentMethodId:string) {
    const customer = await getOrCreateCustomer(userId);
    if (customer.metadata.firebaseUID !== userId) {
      throw Error('Firebase UID does not match Stripe Customer');
    }
    
    const detached = await stripe.paymentMethods.detach(
        paymentMethodId
    )
    return detached;
}



/**
 * Gets the exsiting Stripe customer or creates a new record
 */
export async function getOrCreateCustomer(userId: string, params?: Stripe.CustomerCreateParams) {

    const userSnapshot = await db.collection(userId).doc('Profile').get();

    const { stripeCustomerId, email } = userSnapshot.data() || {};

    // If missing customerID, create it
    if (!stripeCustomerId) {
        // CREATE new customer
        const customer: Stripe.Customer = await stripe.customers.create({
            email,
            metadata: {
                firebaseUID: userId
            },
            ...params
        });
        await userSnapshot.ref.update({ stripeCustomerId: customer.id });
        return customer;
    } else {
        return await stripe.customers.retrieve(stripeCustomerId) as Stripe.Customer;
    }

}