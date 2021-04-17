document.flexGallery = document.flexGallery || {};

const fLog = function (fnGetObj) {
    if (document.flexGallery.customLoggingEnabled && typeof fnGetObj === 'function')
        console.log(fnGetObj());
};

const populateGallery = function (imgUrls, colElements) {

    document.addEventListener("DOMContentLoaded", function () {

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

        const balanceHeight = !!document.flexGallery.heightBalancingEnabled,
            totalCols = colElements.length,
            columnMetaInfos = [],
            totalItems = imgUrls.length,
            avgItemsPerCol = totalItems / totalCols,
            upperAmountPerCol = Math.ceil(avgItemsPerCol);

        const imgLoadingPromises = imgUrls.map((url) => loadImageAsync(url));

        Promise.allSettled(imgLoadingPromises).
            then(imageInfos => imageInfos.forEach(result => fLog(() => result.value)));

        fLog(() => imgLoadingPromises);

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
    });
};

const projectGalleryItem = function (imgUrl, colEl) {

    const colWidth = colEl.width,
        loadedImageInfo = loadImageAsync(imgUrl),
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

const loadImageAsync = function (imgUrl) {

    return new Promise(function (resolve, reject) {

        const workshopDiv = document.getElementById(workshopDivId);
        if (!workshopDiv)
            throw Error('flex gallery workshop div element is missing');

        const imgEl = document.createElement("img"),
            info = Object.assign(new LoadedImageInfo(), {
                imgUrl,
                imgEl,
                ready: false
            });

        imgEl.onload = function () {
            info.loadedWidth = imgEl.width;
            info.loadedHeight = imgEl.height;
            info.ready = true;
            
            fLog(() => info);

            resolve(info);
        };

        imgEl.onerror = function(message, source, lineno, colno, error) {
            reject(message);
        };

        imgEl.src = imgUrl;

        workshopDiv.appendChild(imgEl);
    });
};

const LoadedImageInfo = function () { },
    LoadedGalleryItemInfo = function () { };

const workshopDivId = 'flexGalleryWorkshopDiv';

document.addEventListener("DOMContentLoaded", function () {
    let workshopDiv = document.getElementById(workshopDivId);

    if (!workshopDiv) {
        workshopDiv = document.createElement('div');

        workshopDiv.id = workshopDivId;
        workshopDiv.style.position = 'absolute';
        workshopDiv.style.left = 1000;
        workshopDiv.style.right = 1000;
        workshopDiv.style.backgroundColor = 'yellow';
        workshopDiv.style.boxSizing = 'border-box';

        document.body.appendChild(workshopDiv);
    }

});
