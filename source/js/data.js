export async function fetchData(file) {
    const response = await fetch(`data/${file}`);
    const data = await response.text();
    return data.split('\n');
}
