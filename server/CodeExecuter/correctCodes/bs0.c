#include <stdio.h>
#include <stdlib.h>

int predicate(int x, int k)
{
    if (x > k)
        return 1;
    return 0;
}

int binarySearch(int arr[], int n, int k)
{
    // edge case
    if (k < arr[0] || k > arr[n - 1])
        return -1;

    int l = 0, r = n - 1, m;
    while (l < r - 1)
    {
        m = l + (r - l) / 2; // to avoid overflow
        if (predicate(arr[m], k) == 0)
            l = m;
        else
            r = m;
    }
    if (arr[l] == k)
        return l;
    // edge case: when ans is last element
    if (arr[r] == k)
        return r;
    return -1;
}

int main()
{
    int n, k;
    scanf("%d", &n);
    int *arr = (int *)calloc(n, sizeof(int));
    for (int i = 0; i < n; ++i)
        scanf("%d", &arr[i]);
    scanf("%d", &k);
    printf("%d", binarySearch(arr, n, k));
    free(arr);
    return 0;
}
