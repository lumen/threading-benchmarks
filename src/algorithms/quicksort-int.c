#include <stdlib.h>
#include <time.h>

void quicksort_int(int *array, int start, int end) {
  if (start >= end) {
    return;
  }
  int pivot = array[end];
  int left = 0;
  int right = 0;
  while (left + right < end - start) {
    int num = array[start + left];
    if (num < pivot) {
      left++;
    } else {
      array[start + left] = array[end - right - 1];
      array[end - right - 1] = pivot;
      array[end - right] = num;
      right++;
    }
  }
  quicksort_int(array, start, start + left - 1);
  quicksort_int(array, start + left + 1, end);
}

void randomize_int_array(int *array) {
  srand(time(0));

  int l = sizeof(array) / sizeof(array[0]);
  for (int i = 0; i < l; i++) {
    array[i] = rand();
  }
}
