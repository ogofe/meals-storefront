

function useSubdomain(){
	try{
		let sub = window.location.hostname.split('.')[0]
		return sub
	}catch(err){
		throw new Error("useSubdomain must be called within a page context")
	}
}


module.exports = {useSubdomain, };