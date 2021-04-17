document.flexGallery = document.flexGallery || {};

const fLog = function (fnGetObj) {
    if (document.flexGallery.customLoggingEnabled && typeof fnGetObj === 'function')
        console.log(fnGetObj());
};

const populateGallery = function (imgUrls, colElements) {

    if (!imgUrls)
        throw Error('missing the image urls argument');

    if (!Array.isArray(imgUrls))
        throw Error('the image urls argument is not an array');

    if (!colElements)
        throw Error('missing the column elements collection argument');

    if (colElements['length'] === undefined)
        throw Error('column elements collection argument does not have a length property');

    if (imgUrls.length !== 0 && colElements.length <= 0)
        throw Error('no columns available to fit the ' + imgUrls.length + ' images into');

    // ** calculate column contents **

    const fitToHeight = !!document.flexGallery.fitToHeight,
        totalCols = colElements.length,
        columnMetaInfos = [],
        totalItems = imgUrls.length,
        avgItemsPerCol = totalItems / totalCols,
        upperAmountPerCol = Math.ceil(avgItemsPerCol);

    let usedItemCount = 0;

    // create meta data per column

    for (let iCol = 0; iCol < colElements.length; iCol += 1) {

        const remainingItems = totalItems - usedItemCount,
            colItemCount = remainingItems < upperAmountPerCol ? remainingItems : upperAmountPerCol,
            outerSliceStart = usedItemCount,
            outerSliceEnd = outerSliceStart + colItemCount,
            colMeta = {
                colIndex: iCol,
                colEl: colElements[iCol],
                colItemCount: colItemCount,
                items: imgUrls.slice(outerSliceStart, outerSliceEnd),
                avgAmountPerCol: avgItemsPerCol
            };

        fLog(() => colMeta);

        columnMetaInfos[iCol] = colMeta;

        usedItemCount += colItemCount;
    }

    // ** populate DOM **

    for (let iCol = 0; iCol < colElements.length; iCol += 1) {

        const colMeta = columnMetaInfos[iCol];

        for (let iItem = 0; iItem < colMeta.items.length; iItem += 1) {
            const img = document.createElement('img');
            img.src = colMeta.items[iItem];
            colMeta.colEl.appendChild(img);
        }
    }

};

const projectGalleryItem = function (imgUrl, colEl) {

    const colWidth = colEl.width,
        loadedImageInfo = loadImage(imgUrl),
        imgWidthDiffFactor = colWidth / loadedImageInfo.loadedWidth,
        galleryImageHeight = loadedImageInfo.loadedHeight * imgWidthDiffFactor,
        info = Object.assign(new LoadedGalleryItemInfo(), {
            colEl,
            colWidth,
            loadedImageInfo,
            imgWidthDiffFactor,
            galleryImageHeight,
            imgUrl
        });

    return info;
};

const loadImage = function (imgUrl) {

    const imgEl = document.createElement("img");
    imgEl.src = imgUrl;

    const loadedWidth = imgEl.width,
        loadedHeight = imgEl.height,
        info = Object.assign(new LoadedImageInfo(), {
            loadedWidth,
            loadedHeight,
            imgEl,
            imgUrl
        });

    fLog(Object.assign({ '_debug': '' }, imgEl));

    return info;
};

const LoadedImageInfo = function () { },
    LoadedGalleryItemInfo = function () { };
