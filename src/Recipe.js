import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"

function Recipe() {
    const spaceId = process.env.REACT_APP_DEV_CONTENTFUL_SPACE_ID
    const accessToken = process.env.REACT_APP_DEV_CONTENTFUL_ACCESS_TOKEN
    const { id } = useParams();
    const query = `
    {
        recipeName(id: "${id}") {
            name,
            picture {
                url
            },
            instructions,
            ingredients {json},
            contentfulMetadata {tags
                {name}
            },
            course
        }
    }`
    const [recipe, setRecipe] = useState(null)


    useEffect(() => {
        window
            .fetch(`https://graphql.contentful.com/content/v1/spaces/${spaceId}/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // Authenticate the request
                    Authorization: `Bearer ${accessToken}`,
                },
                // send the GraphQL query
                body: JSON.stringify({ query }),
            })
            .then((response) => response.json())
            .then(({ data, errors }) => {
                if (errors) {
                    console.error(errors);
                }
                console.log(data.recipeName)
                // rerender the entire component with new data
                setRecipe(data.recipeName);
            });
    }, []);

    if (!recipe) {
        return "Loading...";
    }
    const ingredientsList = recipe.ingredients.json.content[0].content
    return (
        <div className="recipePage">
            <h3>{recipe.name}</h3>
            <img src={recipe.picture.url} alt={recipe.name}/>
            <span>Course:</span><p>{recipe.course}</p>
            <span>Tags:</span>
            {recipe.contentfulMetadata.tags.map((tag, i) => <p key={recipe.name + tag + i}>{tag.name}</p>)}
            <span>Ingredients:</span>
            {
                ingredientsList.map((ingredient, i) => {
                    return (<p key={recipe.name + ingredient + i}>{ingredient.content[0].content[0].value}</p>)
                })
            }
            <span>Instructions:</span>
            <p>{recipe.instructions}</p>
        </div>
    )
}

export default Recipe