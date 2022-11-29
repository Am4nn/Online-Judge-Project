const c = `#include <stdio.h>
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
`;

const cpp = `#include <bits/stdc++.h>
#define endl '\\n'
using namespace std;

int predicate(int x, int k)
{
    if (x > k)
        return 1;
    return 0;
}

int binarySearch(vector<int> arr, int n, int k)
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
    cin >> n;
    vector<int> arr(n);
    for (size_t i = 0; i < n; i++)
        cin >> arr[i];
    cin >> k;
    cout << binarySearch(arr, n, k);
    return 0;
}
`;

const java = `// Don't make any public class,
// use this Solution class because its main() function
// will be called while compilation and execuation.
// There must be Solution class in your java code !

import java.util.Scanner;

class Solution {
    public static int binarySearch(int[] arr, int first, int last, int key) {
        int mid = (first + last) / 2;
        while (first <= last) {
            if (arr[mid] < key) {
                first = mid + 1;
            } else if (arr[mid] == key) {
                return mid;
            } else {
                last = mid - 1;
            }
            mid = (first + last) / 2;
        }
        return -1;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) {
            arr[i] = sc.nextInt();
        }
        int k = sc.nextInt();
        sc.close();
        int ans = binarySearch(arr, 0, n - 1, k);
        System.out.println(ans);
    }
}
`;

const py = `def binary_search(arr, x):
    low = 0
    high = len(arr) - 1
    mid = 0

    while low <= high:

        mid = (high + low) // 2

        if arr[mid] < x:
            low = mid + 1

        elif arr[mid] > x:
            high = mid - 1

        else:
            return mid

    return -1


arr = []
n = int(input())

for i in range(0, n):
    ele = int(input())
    arr.append(ele)

x = int(input())

result = binary_search(arr, x)
print(result)
`;

const js = `// ##############################################################################
'use strict';

process.stdin.resume();
process.stdin.setEncoding('utf-8');

let inputString = '';
let currentLine = 0;

process.stdin.on('data', inputStdin => {
    inputString += inputStdin;
});

process.stdin.on('end', _ => {
    inputString = inputString.trim().split('\\n').map(string => {
        return string.trim();
    });

    main();
});

// this function will help in taking input
function readline() {
    return inputString[currentLine++];
}
// ##############################################################################
// Make a Snippet for the code above this and then write your logic in main();

function main() {
    // remember in our platform for a test case a input is given as a single line
    // hence readline() will give whole input in a space seperated string
    /** @type {Array} - num is an array of integers */
    const num = readline().split(" ").map(int => parseInt(int));
    let currentInt = 0;
    const getNextInt = () => num[currentInt++];

    const n = getNextInt();
    const arr = [];
    for (let i = 0; i < n; i++) {
        arr.push(getNextInt());
    }
    const k = getNextInt();
    const ans = binarySearch(arr, 0, n - 1, k);
    console.log(ans);
}

function binarySearch(arr, first, last, key) {
    let mid = Math.floor((first + last) / 2);
    while (first <= last) {
        if (arr[mid] < key) {
            first = mid + 1;
        } else if (arr[mid] == key) {
            return mid;
        } else {
            last = mid - 1;
        }
        mid = Math.floor((first + last) / 2);
    }
    return -1;
}
`;

const bs0 = { c, cpp, java, py, js };
export default bs0;
