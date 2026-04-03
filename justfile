# Technology Radar - Command Runner
# Run `just` to see available commands

# Default recipe: show help
default:
    @just --list

# Install dependencies
install:
    bun install

# Start development server
dev:
    bun dev

# Build static site to out/ directory (validates radar.json with Zod)
build:
    bun run build

# Preview production build
serve:
    bun run serve

# Build and serve (full production preview)
preview: build serve

# Type check with tsc
typecheck:
    bunx tsc --noEmit

# Clean build output
clean:
    rm -rf out .next

# Full rebuild from scratch
rebuild: clean install build
