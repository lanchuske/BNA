# Makefile para gestión del proyecto BNA Organigrama
# Uso: make <comando>

.PHONY: help status add commit push-dev push-main dev main clean install test

# Colores para output
GREEN = \033[0;32m
YELLOW = \033[1;33m
RED = \033[0;31m
NC = \033[0m # No Color

# Variables
BRANCH_DEV = dev
BRANCH_MAIN = main
COMMIT_MSG ?= "Actualización automática"

# Comando por defecto
help:
	@echo "$(GREEN)═══════════════════════════════════════════════════════════════$(NC)"
	@echo "$(GREEN)                    BNA ORGANIGRAMA MAKEFILE                    $(NC)"
	@echo "$(GREEN)═══════════════════════════════════════════════════════════════$(NC)"
	@echo ""
	@echo "$(YELLOW)Comandos disponibles:$(NC)"
	@echo ""
	@echo "  $(GREEN)make help$(NC)        - Mostrar esta ayuda"
	@echo "  $(GREEN)make status$(NC)      - Ver estado del repositorio"
	@echo "  $(GREEN)make add$(NC)         - Agregar todos los cambios al stage"
	@echo "  $(GREEN)make commit$(NC)      - Hacer commit con mensaje automático"
	@echo "  $(GREEN)make dev$(NC)         - Push rápido a rama dev (add + commit + push)"
	@echo "  $(GREEN)make main$(NC)        - Push rápido a rama main (add + commit + push)"
	@echo "  $(GREEN)make push-dev$(NC)    - Solo push a dev (sin add/commit)"
	@echo "  $(GREEN)make push-main$(NC)   - Solo push a main (sin add/commit)"
	@echo "  $(GREEN)make clean$(NC)       - Limpiar archivos temporales"
	@echo "  $(GREEN)make test$(NC)        - Abrir organigrama en Chrome para testing"
	@echo ""
	@echo "$(YELLOW)Ejemplos de uso:$(NC)"
	@echo "  make dev COMMIT_MSG=\"Nuevas funcionalidades\""
	@echo "  make main COMMIT_MSG=\"Release v1.0\""
	@echo ""

# Ver estado del repositorio
status:
	@echo "$(GREEN)📊 ESTADO DEL REPOSITORIO$(NC)"
	@echo "═══════════════════════════"
	@git status
	@echo ""
	@echo "$(YELLOW)📋 Últimos commits:$(NC)"
	@git log --oneline -5

# Agregar cambios al stage
add:
	@echo "$(GREEN)📝 AGREGANDO CAMBIOS AL STAGE$(NC)"
	@git add .
	@echo "$(GREEN)✅ Cambios agregados$(NC)"

# Hacer commit
commit:
	@echo "$(GREEN)💾 HACIENDO COMMIT$(NC)"
	@git commit -m "$(COMMIT_MSG)" || echo "$(YELLOW)⚠️  No hay cambios para commit$(NC)"

# Push solo a dev
push-dev:
	@echo "$(GREEN)🚀 PUSHING TO DEV$(NC)"
	@git push origin $(BRANCH_DEV)
	@echo "$(GREEN)✅ Push a dev completado$(NC)"

# Push solo a main
push-main:
	@echo "$(GREEN)🚀 PUSHING TO MAIN$(NC)"
	@git push origin $(BRANCH_MAIN)
	@echo "$(GREEN)✅ Push a main completado$(NC)"

# Proceso completo para dev (add + commit + push)
dev: add commit push-dev
	@echo ""
	@echo "$(GREEN)🎉 PROCESO COMPLETO A DEV FINALIZADO$(NC)"
	@echo "════════════════════════════════════════"
	@echo "✅ Cambios agregados"
	@echo "✅ Commit realizado: $(COMMIT_MSG)"
	@echo "✅ Push a dev completado"
	@echo ""

# Proceso completo para main (add + commit + push)
main: add commit push-main
	@echo ""
	@echo "$(GREEN)🎉 PROCESO COMPLETO A MAIN FINALIZADO$(NC)"
	@echo "═════════════════════════════════════════"
	@echo "✅ Cambios agregados"
	@echo "✅ Commit realizado: $(COMMIT_MSG)"
	@echo "✅ Push a main completado"
	@echo ""

# Limpiar archivos temporales
clean:
	@echo "$(GREEN)🧹 LIMPIANDO ARCHIVOS TEMPORALES$(NC)"
	@find . -name "*.log" -delete 2>/dev/null || true
	@find . -name "*.tmp" -delete 2>/dev/null || true
	@find . -name ".DS_Store" -delete 2>/dev/null || true
	@find . -name "node_modules" -type d -exec rm -rf {} + 2>/dev/null || true
	@echo "$(GREEN)✅ Limpieza completada$(NC)"

# Abrir organigrama en Chrome para testing
test:
	@echo "$(GREEN)🧪 ABRIENDO ORGANIGRAMA EN CHROME PARA TESTING$(NC)"
	@open -a "Google Chrome" organigrama_interactivo.html || echo "$(RED)❌ Error: Chrome no encontrado$(NC)"

# Comando para verificar que estamos en la rama correcta antes de push
check-branch-dev:
	@current_branch=$$(git branch --show-current); \
	if [ "$$current_branch" != "$(BRANCH_DEV)" ]; then \
		echo "$(RED)⚠️  ADVERTENCIA: No estás en la rama dev (estás en $$current_branch)$(NC)"; \
		echo "$(YELLOW)¿Continuar? [y/N]$(NC)"; \
		read -r confirm; \
		if [ "$$confirm" != "y" ] && [ "$$confirm" != "Y" ]; then \
			echo "$(RED)❌ Operación cancelada$(NC)"; \
			exit 1; \
		fi; \
	fi

check-branch-main:
	@current_branch=$$(git branch --show-current); \
	if [ "$$current_branch" != "$(BRANCH_MAIN)" ]; then \
		echo "$(RED)⚠️  ADVERTENCIA: No estás en la rama main (estás en $$current_branch)$(NC)"; \
		echo "$(YELLOW)¿Continuar? [y/N]$(NC)"; \
		read -r confirm; \
		if [ "$$confirm" != "y" ] && [ "$$confirm" != "Y" ]; then \
			echo "$(RED)❌ Operación cancelada$(NC)"; \
			exit 1; \
		fi; \
	fi

# Versiones con verificación de rama
dev-safe: check-branch-dev dev

main-safe: check-branch-main main

# Información del proyecto
info:
	@echo "$(GREEN)📋 INFORMACIÓN DEL PROYECTO$(NC)"
	@echo "═══════════════════════════════"
	@echo "Proyecto: BNA Organigrama Interactivo"
	@echo "Rama actual: $$(git branch --show-current)"
	@echo "Último commit: $$(git log -1 --format='%h - %s (%cr)')"
	@echo "Archivos principales:"
	@echo "  - organigrama_interactivo.html"
	@echo "  - organigrama_interactivo_v0.html"
	@echo "  - unidades_organizativas_completo.html" 