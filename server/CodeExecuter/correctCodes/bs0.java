// Don't make any public class,
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
