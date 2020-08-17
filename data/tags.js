const tags = [];

const createTag = (tagsToInsert) => {
    tagsToInsert.forEach(tag => {
        if (!tags.includes(tag)) {
            tags.push(tag);
        }
    });
};

const getTags = () => {
    return tags;
};

module.exports = { createTag, getTags };