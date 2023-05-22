use anyhow::Result;

#[tokio::test]
async fn test_graphql_handler_get() -> Result<()> {
    let client = httpc_test::new_client("http://localhost:8080")?;
    let res = client.do_get("/").await?;
    if let Some(allow_credentials) = res.header("access-control-allow-credentials") {
        assert_eq!(allow_credentials, "true".to_string());
    }
    Ok(())
}

#[tokio::test]
async fn test_graphql_handler_post() -> Result<()> {
    let client = httpc_test::new_client("http://localhost:8080")?;
    let res = client
        .do_post(
            "/",
            ("{ \"query\": \"listProduct {name}\"}", "application/json"),
        )
        .await?;
    if let Some(allow_credentials) = res.header("access-control-allow-credentials") {
        assert_eq!(allow_credentials, "true".to_string())
    }
    Ok(())
}
