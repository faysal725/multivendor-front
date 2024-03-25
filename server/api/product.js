export default defineEventHandler(async(event) => {
  const {backendUrl , apiVersion} = useRuntimeConfig().public
  const query = getQuery(event)
  const slug = query.slug
  const product =  await $fetch(apiVersion+'/products/'+slug, {
    baseURL : backendUrl,
    method: 'GET',
  })
  return product;
  
})