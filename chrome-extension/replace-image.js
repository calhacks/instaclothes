(function() {
  console.log('Data', data)

  console.log('setting attribute')
  const img = document.querySelector(`img[src$='${data.old}']`)
  img.setAttribute('src', data.url)
})()
