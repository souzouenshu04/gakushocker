use anyhow::Result;

#[tokio::test]
#[ignore]
async fn test_middleware() -> Result<()> {
    let client = httpc_test::new_client("http://localhost:8080")?;
    Ok(())
}
