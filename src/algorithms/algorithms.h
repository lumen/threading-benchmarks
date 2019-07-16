#include <stdbool.h>

extern const int FIBONACCI;
extern const int MULTIPLY_INT;
extern const int QUICKSORT_INT;
extern const int FIBONACCI_ON_MAIN;
extern const int FIBONACCI_ON_MAIN_1K;

char *algorithm_name(int a);

void perform_algorithm(int a, bool is_main_thread, bool is_post_message);
