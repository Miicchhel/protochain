/**
 * The type of the transaction
 * @REGULAR normal transaction, without any associated fee
 * @FEE involves paying an additional fee
 */
enum TransactionType {
    REGULAR = 1,
    FEE = 2 
}

export default TransactionType;