'use strict';

const fs = require(`fs`);
const {getRandomInt, shuffle} = require(`../../utils`);
const {DEFAULT_COUNT, MAX_COUNT, FILE_NAME, TITLES, SENTENCES, CATEGORIES, OfferType, SumRestrict, PictureRestrict, ExitCode} = require(`../constants`);

const getPostfixPictureFileName = (postfix) => {
  if (postfix < 10) {
    return `0${postfix}`;
  }
  return postfix;
};

const getPictureFileName = (postfix) => {
  return `item${getPostfixPictureFileName(postfix)}.jpg`;
};


const generateOffers = (count) => (
  Array(count).fill({}).map(() => ({
    category: [CATEGORIES[getRandomInt(0, CATEGORIES.length - 1)]],
    description: shuffle(SENTENCES).slice(1, 5).join(` `),
    picture: getPictureFileName(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)),
    title: TITLES[getRandomInt(0, TITLES.length - 1)],
    type: Object.keys(OfferType)[Math.floor(Math.random() * Object.keys(OfferType).length)],
    sum: getRandomInt(SumRestrict.MIN, SumRestrict.MAX),
  }))
);

const getCountOffer = (args) => {
  const [count] = args;
  const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
  return countOffer;
};

module.exports = {
  name: `--generate`,
  run(args) {
    const countOffer = getCountOffer(args);

    if (countOffer > MAX_COUNT) {
      console.error(`Не больше 1000 объявлений`);
      process.exit(ExitCode.error);
    }

    const content = JSON.stringify(generateOffers(countOffer));
    fs.writeFile(FILE_NAME, content, (err) => {
      if (err) {
        console.error(`Can't write data to file...`);
        process.exit(ExitCode.error);
      }

      console.info(`Operation success. File created.`);
      process.exit(ExitCode.success);
    });
  },
};
