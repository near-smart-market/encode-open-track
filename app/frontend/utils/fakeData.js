import faker from "faker";



const getProduct = () => {
    const id = faker.internet.ipv6();
    const name = faker.commerce.productName();
    const price = faker.commerce.price();
    const currency = "USDT";
    const inventory = faker.random.number();

    const description = faker.lorem.paragraph();

    let slides = [];
    for(let i =0; i < 3; ++i) {
        slides.push({
            img: `https://picsum.photos/${faker.random.number()%500}/${faker.random.number()%500}`,
            title: faker.lorem.word(),
            body: faker.lorem.words(),
        })
    }

    return {
        id,
        name,
        price,
        currency,
        inventory,
        description,
        slides
    }
}

export {
    getProduct
}