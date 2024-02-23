const anios = [];

for (
    let i = new Date().getFullYear();
    i >= new Date().getFullYear() - 23;
    i--
) {
    anios.push({
        id: i,
        año: i,
    });
}

export { anios };
