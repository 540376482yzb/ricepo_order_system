// normalize async error sent back from server
export const normalizeResponseErrors = res => {
	if (!res.ok) {
		if (
			res.headers.has('content-type') &&
			res.headers.get('content-type').startWith('application/json')
		) {
			//return meaningful errors
			return res.json().then(err => Promise.reject(err))
		}
		// return all other errors
		return Promise.reject({
			code: res.status,
			message: res.statusText
		})
	}
	return res
}
