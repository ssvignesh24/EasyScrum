export default (array_)=>{
  const array = [].concat(array_);
  if(array.length <= 1) return array[0];
  else if(array.length == 2) return array.join(", and ")
  else{
    const last_value = array.pop();
    return array.join(", ") + ", and " + last_value;
  }
}