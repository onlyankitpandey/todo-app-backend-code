export const jsonGenerator = (statusCose, message, data = null) => {
  return { status: statusCose, message: message, data: data }
}