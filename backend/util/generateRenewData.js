
/**
 * 
 * @returns Date
 */
const renewDate = () =>{
    const renewData = Date.now() + 1000 * 60 * 60  * 24 *15 
    const returnRenewDate = new Date(renewData)
    return returnRenewDate
}

module.exports  = {
    renewDate
}