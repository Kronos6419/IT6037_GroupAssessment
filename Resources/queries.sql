/*Browse articles by category*/
SELECT a.articleID,
        a.articleName,
        a.type,
        a.about,
        c.categoryName
        
FROM   Article  AS a
JOIN   Category AS c ON a.categoryID = c.categoryID
WHERE  c.categoryName = ?     
ORDER BY a.articleName;


/*Search articles by keyword in the title*/
SELECT  a.articleID,
        a.articleName,
        a.type,
        c.categoryName
FROM   Article  AS a
JOIN   Category AS c ON a.categoryID = c.categoryID
WHERE LOWER(a.articleName) LIKE '%' || LOWER(?) || '%'
ORDER BY a.articleName;


/*List all articles*/
SELECT  a.articleID,
        a.articleName,
        a.type,
        a.born,
        a.died,
        a.nationality,
        a.knownFor,
        a.notableWork,
        a.about,
        a.paintingYear,
        a.paintingMedium,
        a.paintingDimensions,
        a.paintingLocation,
        a.developer,
        c.categoryName
FROM   Article  AS a
JOIN   Category AS c ON a.categoryID = c.categoryID
ORDER BY a.articleID DESC;


/*Insert a new article*/
INSERT INTO Article (
        categoryID,
        type,
        articleName,
        born,
        died,
        nationality,
        knownFor,
        notableWork,
        about,
        paintingYear,
        paintingMedium,
        paintingDimensions,
        paintingLocation,
        developer
) VALUES (
        ?,  -- categoryID
        ?,  -- type
        ?,  -- articleName
        ?,  -- born
        ?,  -- died
        ?,  -- nationality
        ?,  -- knownFor
        ?,  -- notableWork
        ?,  -- about
        ?,  -- paintingYear
        ?,  -- paintingMedium
        ?,  -- paintingDimensions
        ?,  -- paintingLocation
        ?   -- developer
);


/*Update an existing article*/
UPDATE Article
SET    categoryID         = ?,
        type               = ?,
        articleName        = ?,
        born               = ?,
        died               = ?,
        nationality        = ?,
        knownFor           = ?,
        notableWork        = ?,
        about              = ?,
        paintingYear       = ?,
        paintingMedium     = ?,
        paintingDimensions = ?,
        paintingLocation   = ?,
        developer          = ?
WHERE  articleID          = ?;


/*Delete an article*/
DELETE FROM Article
WHERE  articleID = ?;