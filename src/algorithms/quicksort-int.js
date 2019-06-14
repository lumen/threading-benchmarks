export function quicksortInt(array, start, end) {
  if (start >= end) {
    return;
  }
  let pivot = array[end];
  let left = 0;
  let right = 0;
  while (left + right < end - start) {
    let num = array[start + left];
    if (num < pivot) {
      left++;
    } else {
      array[start + left] = array[end - right - 1];
      array[end - right - 1] = pivot;
      array[end - right] = num;
      right++;
    }
  }
  quicksortInt(array, start, start + left - 1);
  quicksortInt(array, start + left + 1, end);
}

export function randomizeIntArray(array) {
  for (var i = 0, il = array.length; i < il; i++) {
    array[i] = ((Math.random() * 20000) | 0) - 10000;
  }
}
