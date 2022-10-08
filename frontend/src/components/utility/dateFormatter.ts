/** This Function takes in a date and returns it in MM/DD/YYYY string format */
function dateFormatter(date: Date): string {
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let year = date.getFullYear();
  return `${month}/${day}/${year}`
}

export { dateFormatter }