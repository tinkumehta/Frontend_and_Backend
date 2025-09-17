import crypto from 'crypto'

export const verifyPaymentSignature = (orderId, paymentId, signature, secret) => {
    const body = orderId + '|' + paymentId;
    const expectedSignature = crypto
            .createHash('sha256', secret)
            .update(body.toString())
            .digest('hex');

    return expectedSignature === signature;
}