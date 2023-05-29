use anyhow::Result;

#[tokio::test]
#[ignore]
async fn test_graphql_handler_get() -> Result<()> {
    let client = httpc_test::new_client("http://localhost:8080")?;
    let res = client.do_get("/").await?;
    res.print().await?;
    Ok(())
}

#[tokio::test]
#[ignore]
async fn test_graphql_handler_post() -> Result<()> {
    let client = httpc_test::new_client("http://localhost:8080")?;
    let res = client
        .do_post(
            "/",
            ("{ \"query\": \"listProduct {name}\"}", "application/json"),
        )
        .await?;
    res.print().await?;
    Ok(())
}
