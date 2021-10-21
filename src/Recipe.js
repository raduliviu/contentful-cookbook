import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'

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
            instructions {json},
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

    let recipeTags = []
    recipe.contentfulMetadata.tags.forEach(tag => recipeTags.push(tag.name))
    console.log(recipeTags)

    return (
        <div className="recipePage">
            <img src={recipe.picture.url} alt={recipe.name} />
            <h2>{recipe.name}</h2>
            <div className="recipeField recipeTags">
                <span>Tags: </span>
                {
                    <span>{recipeTags.join(', ')}</span>
                }
            </div>
            <div className="recipeField recipeIngredients">
                <h4>Ingredients:</h4>
                {documentToReactComponents(recipe.ingredients.json)}
            </div>
            <div className="recipeField recipeInstructions">
                <h4>Instructions:</h4>
                {documentToReactComponents(recipe.instructions.json)}
            </div>
            <div className="recipeField recipeCourse">
                <span>Course: </span><span>{recipe.course}</span>
            </div>
        </div>
    )
}

export default Recipe