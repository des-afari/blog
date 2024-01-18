import { formatDistanceToNow, parseISO } from 'date-fns'

export const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+[{\]};:"",<.>/?]).{10,}$/
export const nameRegex = /\w{2,}/

export function formatDate(date: Date) {
	if (date) {
		const inputDate = parseISO(String(date))
		return formatDistanceToNow(inputDate, {addSuffix: true})
	}
}

export function formatTitle(input: string|null) {
	if (input) {
		return input.toLowerCase().replace(/\s+/g, '-')
	}
}

export function htmlToText(htmlString: string) {
  const doc = new DOMParser().parseFromString(htmlString, 'text/html')
  return doc.body.textContent || ""
}