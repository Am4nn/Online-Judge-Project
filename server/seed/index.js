const Question = require('../DataBase/Model/Question');
const mongoose = require('mongoose')

const data = [
    {
        name: "Binary Search ",
        description: "Given a sorted array of size N and an integer K, find the position at which K is present in the array using binary search. If key lnot found return -1",
        difficulty: "easy",
        examples: [
            {
                input: `N = 5 
                arr[] = {1 2 3 4 5} 
                K = 4 `,
                output: "3",
                explaination: "in arr array 4 is at 3rd index.",
            },
            {
                input: `N = 5 
                arr[] = {11 22 33 44 55} 
                K = 445 `,
                output: "-1",
                explaination: "445 is not present in arr.",
            }
        ],
        noOfSubm: 185,
        noOfSuccess: 83,
        testcase: 'bs0'
    },
    {
        name: "Allocate minimum number of pages  ",
        description: "You are given N number of books. Every ith book has Ai number of pages. The books are arranged in ascending order.  You have to allocate contiguous books to M number of students. There can be many ways or permutations to do so. In each permutation, one of the M students will be allocated the maximum number of pages. Out of all these permutations, the task is to find that particular permutation in which the maximum number of pages allocated to a student is the minimum of those in all the other permutations and print this minimum value. Each book will be allocated to exactly one student. Each student has to be allocated at least one book. Note: Return -1 if a valid assignment is not possible, and allotment should be in contiguous order (see the explanation for better understanding).",
        difficulty: "hard",
        examples: [
            {
                input: `N = 4 
                A[] = {12,34,67,90} 
                M = 2 `,
                output: "113",
                explaination: 'Allocation can be done in  following ways:{12} and {34, 67, 90}   Maximum Pages = 191{12, 34} and {67, 90}  Maximum Pages = 157{12, 34, 67} and {90} Maximum Pages =113. Therefore, the minimum of these cases is 113, which is selected as the output.'
            },
            {
                input: `N = 3 
                A[] = {15,17,20} 
                M = 2 `,
                output: "32",
                explaination: "Allocation is done as {15,17} and {20}"
            }
        ],
        noOfSubm: 0,
        noOfSuccess: 0,
        testcase: 'amnop0'
    },
    {
        difficulty: 'easy',
        name: 'Simple Search',
        description: 'A simple searching question, search key in an array',
        examples: [
            {
                input: 'key: 7,  arr[] = [5, 9, 6, 7, 3]',
                output: '3',
                explaination: 'in arr array 7 key is at 3rd index'
            },
            {
                input: 'key: 18,  arr[] = [94, 12, 78, 23, 19, 48, 12, 36, 45]',
                output: '1',
                explaination: "in arr array 18 key's first occurance is at 3rd index"
            }
        ],
        noOfSubm: 109,
        noOfSuccess: 53,
        testcase: 'ss0'
    },
    {
        name: "Save Your Life ",
        description: "Given a string W, integer array B and character array X. Find a substring which has the sum of the ASCII values of its every character, as maximum. ASCII values of some characters are redefined.",
        difficulty: "medium",
        examples: [
            {
                input: `W = abcde 
                N = 1 
                X[] = { 'c' } 
                B[] = { - 1000 } `,
                output: "de",
                explaination: 'Substring "de" has the maximum sum of ascii value, including c decreases the sum value'
            },
            {
                input: `W = dbfbsdbf  
                N = 2 
                X[] = { 'b','s' } 
                B[] = { -100, 45  } `,
                output: "sd",
                explaination: "Substring 'sd' has the maximum sum of ascii value, including 'b' decreases the sum value"
            }
        ],
        noOfSubm: 0,
        noOfSuccess: 0,
        testcase: 'syl0'
    },
    {
        name: "Maximum difference of zeros and ones in binary string",
        description: "Given a binary string S consisting of 0s and 1s. The task is to find the maximum difference of the number of 0s and the number of 1s (number of 0s – number of 1s) in the substrings of a string.",
        difficulty: "easy",
        examples: [
            {
                input: "S = '11000010001' ",
                output: "6",
                explaination: `From index 2 to index 9, 
                there are 7 0s and 1 1s, so number 
                of 0s - number of 1s is 6. `
            },
            {
                input: 'S = "111111"',
                output: "-1",
                explaination: " S contains 1s only "
            }
        ],
        noOfSubm: 0,
        noOfSuccess: 0,
        testcase: 'mdozaoibs0'
    },
]

const connectDB = () => {
    mongoose.connect(
        'mongodb://localhost:27017/oj-server'
    )
        .then(() => {
            console.log("Database Connected !!!");
        })
        .catch(error => {
            console.log("Oh no MONGOOSE Error !!!");
            console.log(error);
        });
}

connectDB();

async function seedDB() {
    await Question.deleteMany({});

    data.forEach(async question => {
        const newQuestion = new Question({ ...question });
        await newQuestion.save();
    })
    // const allQuestions = await Question.find({});
    // console.log(...allQuestions);
}


seedDB().then(() => {
    console.log('Seeded successfully !!!');
    setTimeout(() => {
        mongoose.connection.close();
        console.log('Disconnected !!!');
    }, 1000);
}).catch(err => {
    console.log('Here comes error : \n', err);
});