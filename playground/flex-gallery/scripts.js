document.flexGallery = document.flexGallery || {};

function fLog(fnGetObj) {
    if (document.flexGallery.customLoggingEnabled && typeof (fnGetObj) === 'function')
        console.log(fnGetObj());
}

function populateGallery(imgUrls, colElements) {

    // calculate column contents

    const totalCols = colElements.length,
        columnMetaInfos = [],
        totalItems = imgUrls.length || 0,
        avgAmountPerCol = totalItems / totalCols,
        lastColCount = totalItems - (avgAmountPerCol * totalCols);

    let totalImagesUsed = 0,
        useCeil = true;

    for (let iCol = 0; iCol < colElements.length; iCol += 1) {
        // per column

        let colItemCount = useCeil ? Math.ceil(avgAmountPerCol) : Math.floor(avgAmountPerCol),
            outerSliceStart = totalImagesUsed,
            outerSliceEnd = outerSliceStart + colItemCount;

        let colMeta = {
            colIndex: iCol,
            colEl: colElements[iCol],
            colItemCount: colItemCount,
            items: imgUrls.slice(outerSliceStart, outerSliceEnd),
            avgAmountPerCol: avgAmountPerCol
        };

        columnMetaInfos[iCol] = colMeta;

        fLog(() => colMeta);

        totalImagesUsed += colItemCount;
        useCeil = !useCeil;
    }

    // populate DOM

    for (let iCol = 0; iCol < colElements.length; iCol += 1) {
        const colMeta = columnMetaInfos[iCol];

        for (let iItem = 0; iItem < colMeta.items.length; iItem += 1) {
            const img = document.createElement('img');
            img.src = colMeta.items[iItem];
            colMeta.colEl.appendChild(img);
        }
    }

}
