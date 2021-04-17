let itemUrls = ["https://loremflickr.com/240/320/dog",
    "https://loremflickr.com/320/240/cat",
    "https://loremflickr.com/200/200/dog",
    "https://loremflickr.com/640/800/parrot",
    "https://loremflickr.com/800/640/flower",
    "https://loremflickr.com/350/250/hill",
    "https://loremflickr.com/240/320/browser",
    "https://loremflickr.com/300/300/barn",
    "https://loremflickr.com/500/400/cartoon",
    "https://loremflickr.com/400/500/cow",
    "https://loremflickr.com/450/425/chicken",
    "https://loremflickr.com/425/450/field",
    "https://loremflickr.com/1000/1000/grazing"];

function populateGallery() {
    itemUrls = itemUrls || [];

    // calculate column contents

    const colElements = document.querySelectorAll('body > div.row > div.column'),
        totalCols = colElements.length,
        columnMetas = [],
        totalItems = itemUrls.length || 0,
        maxItemsPerCol = Math.ceil(totalItems / totalCols),
        lastColCount = totalItems - (maxItemsPerCol * totalCols);

    for (let i = 0; i < colElements.length; i += 1) {
        let count = (i == totalCols - 1) ? lastColCount : maxItemsPerCol,
            sliceStart = i * maxItemsPerCol,
            sliceEnd = sliceStart + maxItemsPerCol;

        columnMetas[i] = {
            index: i,
            colEl: colElements[i],
            items: itemUrls.slice(sliceStart, sliceEnd),
            calcCount: maxItemsPerCol
        };
    }

    // populate DOM

    for (let i = 0; i < colElements.length - 1; i += 1) {
        let colMeta = columnMetas[i];
        for(let j = 0; j < colMeta.items.length; j += 1) {
            let img = document.createElement('img');
            img.src = colMeta.items[j];
            colMeta.colEl.appendChild(img);
        }
    }
}
