Build et publication locale de l'image Docker

1) Construire l'image localement

```bash
docker build -t ghcr.io/luoxthedev/reposwipe:latest .
```

2) Se connecter à GHCR (utilise un Personal Access Token avec `write:packages` ou `GITHUB_TOKEN` pour Actions)

```bash
echo $GHCR_PAT | docker login ghcr.io -u <GITHUB_USERNAME> --password-stdin
```

3) Pousser l'image

```bash
docker push ghcr.io/luoxthedev/reposwipe:latest
```

Remarques:
- Le workflow GitHub Actions (`.github/workflows/docker-publish.yml`) utilise `GITHUB_TOKEN` pour publier automatiquement sur `ghcr.io/${{ github.repository }}` quand on push sur `main`.
- Si tu veux taguer avec le SHA du commit :

```bash
COMMIT_SHA=$(git rev-parse --short HEAD)
docker build -t ghcr.io/luoxthedev/reposwipe:${COMMIT_SHA} .
docker push ghcr.io/luoxthedev/reposwipe:${COMMIT_SHA}
```
