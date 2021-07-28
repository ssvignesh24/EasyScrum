export default function(string, limit){
  if(!string) return "";
  limit = limit || 10;
  return string.length > limit ? string.substring(0, limit - 3) + "..." : string;
}