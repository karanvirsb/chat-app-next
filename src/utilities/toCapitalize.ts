export default function toCapitalize(str: string | undefined): string {
  if (str === undefined) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}
