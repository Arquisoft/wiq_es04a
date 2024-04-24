const getRandomPic = () => {

    const pics = ["teresaIcon.jpg","barreroIcon.jpg","samuIcon.jpg","and1naIcon.jpg",
        "wiffoIcon.jpg","bertinIcon.jpg","hugoIcon.jpg"]


    return pics[Math.floor(Math.random() * pics.length)]; //NOSONAR
};

module.exports =  { getRandomPic };