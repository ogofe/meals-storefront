

/** @params ctx: window.sessionStorage */
export function addToLocalCart(ctx, item){
  let cart = JSON.parse(ctx.getItem('cart'));

  if (cart !== undefined && typeof cart === Array){
    cart.push(item)
    ctx.setItem('cart', JSON.stringify(cart))
    return true
  }

  cart = [item,]
  ctx.setItem('cart', JSON.stringify(cart))
}

export function removeFromLocalCart(ctx, item){
  let cart = JSON.parse(ctx.getItem('cart'));

  if (cart !== undefined && typeof cart === Array){
    cart.splice(item, 1)
    ctx.setItem('cart', JSON.stringify(cart))
    return cart
  }
}

function getLocalCart(ctx) {
  let cart = JSON.parse(ctx.getItem('cart'));

  if (cart === undefined){
    cart = []
    ctx.setItem('cart', JSON.stringify(cart))
  }
  return cart
}



export function parseDate(datestr){
    let created = new Date(datestr);
    let dates = {
      0: 'Sun',
      1: 'Mon',
      2: 'Tue',
      3: 'Wed',
      4: 'Thu',
      5: 'Fri',
      6: 'Sat'
    }
    let date = `
    ${dates[created.getDay()]},
    ${created.getDate()}/${created.getMonth()}/${created.getFullYear()}

    ${created.getHours() - 12}:${created.getMinutes()}
    ${created.getHours() >= 12 ? "pm" : "am"}
    `
    return date
}

export function redirect(path){
	window.location.href = path
}


export default {
	parseDate,
	redirect
} 