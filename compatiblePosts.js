import { supabase } from "./supabase.js";

export async function getCompatiblePosts(
  currentUserId
) {

  // =====================
  // USUARIO ACTUAL
  // =====================

  const {
    data: currentUser,
    error: currentUserError
  } = await supabase
    .from("posts")
    .select("Sexo, Orientacion")
    .eq("user_id", currentUserId)
    .single();

  if (currentUserError)
    throw currentUserError;

  const mySexo =
    currentUser.Sexo;

  const myOrientacion =
    currentUser.Orientacion;

  // =====================
  // POSTS
  // =====================

  const {
    data: allPosts,
    error: postsError
  } = await supabase
    .from("posts")
    .select(`
      imagenPost,
      user_id,
      username,
      Sexo,
      Orientacion,
      updated_at
    `)
    .not(
      "imagenPost",
      "is",
      null
    )
    .neq(
      "user_id",
      currentUserId
    )
    .order(
      "updated_at",
      { ascending: false }
    );

  if (postsError)
    throw postsError;

  // =====================
  // FILTRO 1
  // ELLOS ME BUSCAN
  // =====================

  const compatibleByTheirOrientation =
    allPosts.filter(post =>

      post.Orientacion === "X" ||

      post.Orientacion === mySexo

    );

  // =====================
  // FILTRO 2
  // YO LOS BUSCO
  // =====================

  const finalPosts =
    compatibleByTheirOrientation
      .filter(post => {

        if (
          myOrientacion === "X"
        ) {
          return true;
        }

        return (
          post.Sexo ===
          myOrientacion
        );

      });

  return finalPosts;
}