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
                let recipeTags = []
                recipe.contentfulMetadata.tags.forEach(tag => recipeTags.push(tag.name))
                return (
                    <div className="recipeCard" key={recipe.sys.id}>
                        <NavLink to={`/recipe/${recipe.sys.id}`}>
                            <img src={recipe.picture.url} alt={recipe.name} />
                            <h3>{recipe.name}</h3>
                            <div className="recipeField recipeCourse">
                                <span>Course: </span><span>{recipe.course}</span>
                            </div>
                            <div className="recipeField recipeTags">
                                <span>Tags: </span>
                                {
                                    <span>{recipeTags.join(', ')}</span>
                                }
                            </div>
                        </NavLink>
                    </div>
                )
            })
        }
    </>)
}

export default Home