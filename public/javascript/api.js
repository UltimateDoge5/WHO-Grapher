async function get_data(code, iso){
    const result = await fetch(`/api/${code}?country=${iso}`)
    
    return result.json()
}