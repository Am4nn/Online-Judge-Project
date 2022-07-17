#include <bits/stdc++.h>
#include <unordered_set>
#define endl '\n'
#define fastIO                        \
    ios_base::sync_with_stdio(false); \
    std::cin.tie(NULL);
#define ll long long int
#define For(i, a, n) for (size_t i = a; i < n; ++i)
using namespace std;

int predicate(int x, int k)
{
    if (x > k) return 1;
    return 0;
}

int binarySearch(vector<int> arr, int n, int k)
{
    // edge case
    if (k < arr[0] || k > arr[n - 1]) return -1;

    int l = 0, r = n - 1, m;
    while (l < r - 1)
    {
        m = l + (r - l) / 2; // to avoid overflow
        if (predicate(arr[m], k) == 0) l = m;
        else r = m;
    }
    if (arr[l] == k) return l;
    // edge case: when ans is last element
    if (arr[r] == k) return r;
    return -1;
}

int main()
{
    fastIO;
    int n, k;
    cin >> n;
    vector<int> arr(n);
    For(i, 0, n) cin >> arr[i];
    cin >> k;
    cout << binarySearch(arr, n, k);
    return 0;
}