
export const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+[{\]};:"",<.>/?]).{10,}$/
export const nameRegex = /\w{2,}/

// export const formatTitle = (title: string) => {
// 	if (title) {
// 		return title.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() + " ")
// 	}
// }

export const formatDate = (date: Date) => {
	date = new Date(date)

	return date.toLocaleDateString("en-US", {"year": "numeric", "month": "short", "day": "numeric", "hour": "numeric", "minute": "numeric"})
}