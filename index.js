async function processString(strings, mod) {
    let sorted, unique;
    let numericValues = []
    do {
      numericValues = []
        for(let i = 0; i < strings.length; i++ ){
            // get a ttl as to prevent index overlap
            let start = Date.now()
            await fetch('https://cloudflare-worker-sequence-relayer.yellow-shadow-d7ff.workers.dev/')
            let end = Date.now()
            numericValues.push({str: strings[i], value: strings[i].split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) + (end - start) % mod})
          }
        sorted = numericValues.sort((a, b) => a.value - b.value);
        let values = sorted.map(item => item.value)
        unique = new Set(values).size === sorted.length;
    } while (!unique); // loop if collisions
  
    // Sort the indices based on the sorted numeric values
    let indices = numericValues.map((value, index) => ({value: value.value, index: index, str: value.str}))
                               .sort((a, b) => a.value - b.value)
                               .map(item => item.str);
  
    return { indices };
}

// as a test, but can complete with any strings, and wait to find local min of distribution
let strings = [
    "aello worll",
    "hello world",
    "aello worll",
    "hello world","aello worll",
    "hello world","aello worll",
    "hello world","aello worll",
];

(async () => {
    let result = await processString(strings, 77);
    console.log(result.indices);
})()