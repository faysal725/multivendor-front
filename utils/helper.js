
export const orderStatus = ({order}) => {
 
    let orderStatus
    if (order.is_accepted == false && order.is_declined == false) {
        orderStatus = "Pending"
    } else if (order.is_accepted == true && order.is_declined == false && order.is_delivered == false) {
        orderStatus = "On Progress"
    } else if (order.is_accepted == false && order.is_declined == true && order.is_delivered == false) {
        orderStatus = "Declined"
    }  else if (order.is_accepted == true && order.is_declined == false && order.is_delivered == true) {
        orderStatus = "Delivered"
    } else {
        orderStatus = ""
    }

    return orderStatus
}