import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom"

function Home() {
    const spaceId = process.env.REACT_APP_DEV_CONTENTFUL_SPACE_ID
    const accessToken = process.env.REACT_APP_DEV_CONTENTFUL_ACCESS_TOKEN
    const query = `
  {
    recipeNameCollection {
      items {
        sys{id},
        contentfulMetadata{tags 
          {name}
        },
        name,
        course,
        picture {
          url
        }
      }
    }
  }`

    const [recipes, setRecipes] = useState(null);

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
                console.log(data.recipeNameCollection)
                // rerender the entire component with new data
                setRecipes(data.recipeNameCollection.items);
            });
    }, []);

    if (!recipes) {
        return "Loading...";
    }
    return (<>
        {
            recipes.map((recipe) => {
                return (
                    <div className="recipeCard" key={recipe.sys.id}>
                        <NavLink to={`/recipe/${recipe.sys.id}`}>
                            <h3>{recipe.name}</h3>
                            <img src={recipe.picture.url} alt={recipe.name}/>
                            <span>Course:</span><p>{recipe.course}</p>
                            <span>Tags:</span>
                            {recipe.contentfulMetadata.tags.map((tag, i) => <p key={recipe.name + tag + i}>{tag.name}</p>)}
                        </NavLink>
                    </div>
                )
            })
        }
    </>)
}

export default Home