window.addEventListener("DOMContentLoaded"  , async() => {

    const reponse = await fetch("http://localhost:3000/depenses" )
    const depenses = await reponse.json(); 
    
    document.querySelector(".js-list-depenses").innerHTML = genererFormsDepenses(depenses);

    let compteur = 0;
    depenses.forEach(depense => {
        compteur = compteur + parseInt(depense.price);
    });
    // gestion du nombre de tâches en cours 
    document.querySelector(".js-compteur").innerHTML = compteur

    let compteur_depenses = 0
    depenses.forEach(depense => {
        if(depense.price < 0) compteur_depenses = compteur_depenses + parseInt(depense.price);
    });
    document.querySelector("#depenses").innerHTML = "Dépenses : " + compteur_depenses
    let compteur_recettes = 0
    depenses.forEach(depense => {
        if(depense.price > 0) compteur_recettes = compteur_recettes + parseInt(depense.price);
    });
    document.querySelector("#recettes").innerHTML = "Recettes : " + compteur_recettes


    // écouter quand on clique dans la zone js-list-tache
    document.querySelector(".js-list-depenses").addEventListener("click" , async e => {
        e.preventDefault();
        if(e.target.className.includes("btn")){
            const form = e.target.parentNode.parentNode.firstElementChild.firstElementChild;
            const action = e.target.value ;
            const id = form.id.value
            
            if(action == "modifier"){
                const data = {
                    id : parseInt(id),
                    name : form.name.value,
                    price : parseInt(form.price.value),
                }
                const options = { method : "PUT" , body : JSON.stringify(data) , headers : {'Content-Type': 'application/json'} }
                await fetch("http://localhost:3000/depenses/"+id , options)
            }else if(action == "supprimer"){
                const options = {method : "DELETE"}
                await fetch("http://localhost:3000/depenses/"+id , options);
            }
        }
    })
})

function genererFormsDepenses(data){

    if(data.length === 0) return "<p>Veuillez ajouter des dépenses / recettes</p>";

    return data.map( d => {
        return `<tr>
                    <td><form id="form${d.id}"><input type="hidden" name="id" value="${d.id}" class="form-input" /></form></td>
                    <td><input form="form${d.id}" type="text" name="name" class="form-input" value="${d.name}"></td>
                    <td><input form="form${d.id}" type="text" name="price" class="form-input" value="${d.price}"></td>
                    <td>
                        <input form="form${d.id}" type="submit" class="btn btn-primary mx-3" value="modifier">
                        <input form="form${d.id}" type="submit" class="btn btn-danger" value="supprimer">
                    </td>
                </tr>`
    } ).join("")
}