
/**
 * 
 * @returns Date
 */
const renewDate = (day=15) =>{
    const renewData = (Date.now() + (1000 * 60 * 60  * 24 *day))
    const returnRenewDate = new Date(renewData)
    return returnRenewDate
}

module.exports  = {
    renewDate
}