#!/bin/bash
# Docker Compose Profile Scripts for AcontPlus (Linux/Mac version)
# Usage: ./scripts/docker-profiles.sh <profile> <action> [options]
#
# Examples:
#   ./scripts/docker-profiles.sh core build
#   ./scripts/docker-profiles.sh sales up
#   ./scripts/docker-profiles.sh restaurant logs -f

PROFILE=$1
ACTION=$2
shift 2
OPTIONS="$@"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Profile definitions
declare -A PROFILES

PROFILES[core]="ocelot.api identity.api configuration.api common.api"
PROFILES[sales]="ocelot.api sales.api billing.api inventory.api"
PROFILES[inventory]="ocelot.api inventory.api purchases.api accounting.api"
PROFILES[financial]="ocelot.api accounting.api billing.api purchases.api"
PROFILES[restaurant]="ocelot.api restaurant.api sales.api inventory.api"
PROFILES[automotive]="ocelot.api mechanical.api vet.api technicalsupport.api"
PROFILES[services]="ocelot.api barbershop.api technicalsupport.api"
PROFILES[gateway]="ocelot.api"
PROFILES[all]="ocelot.api accounting.api sales.api billing.api inventory.api purchases.api restaurant.api vet.api mechanical.api barbershop.api technicalsupport.api common.api identity.api configuration.api"

if [ -z "$PROFILE" ] || [ -z "$ACTION" ]; then
    echo -e "${RED}Error: Profile and action are required${NC}"
    echo ""
    echo "Usage: $0 <profile> <action> [options]"
    echo ""
    echo "Profiles: core, sales, inventory, financial, restaurant, automotive, services, gateway, all"
    echo "Actions: build, up, restart, down, logs, stop, start"
    echo ""
    echo "Examples:"
    echo "  $0 core build --parallel"
    echo "  $0 sales up"
    echo "  $0 restaurant logs -f"
    exit 1
fi

SERVICES=${PROFILES[$PROFILE]}

if [ -z "$SERVICES" ]; then
    echo -e "${RED}Error: Profile '$PROFILE' not found${NC}"
    echo "Available profiles: ${!PROFILES[@]}"
    exit 1
fi

# Change to project root
cd "$(dirname "$0")/.." || exit

echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW} AcontPlus Docker Profile: $PROFILE${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${GREEN}Services:${NC}"
for service in $SERVICES; do
    echo -e "  ${NC}• $service${NC}"
done
echo ""
echo -e "${GREEN}Action: $ACTION $OPTIONS${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo ""

case $ACTION in
    build)
        CMD="docker-compose build $OPTIONS $SERVICES"
        echo -e "${YELLOW}Executing: $CMD${NC}"
        $CMD
        ;;

    up)
        CMD="docker-compose up -d $OPTIONS $SERVICES"
        echo -e "${YELLOW}Executing: $CMD${NC}"
        $CMD

        echo ""
        echo -e "${CYAN}Verifying status...${NC}"
        sleep 2
        docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
        ;;

    restart)
        echo -e "${YELLOW}Stopping services...${NC}"
        docker-compose stop $SERVICES

        echo -e "${YELLOW}Starting services...${NC}"
        docker-compose start $SERVICES

        echo ""
        sleep 2
        docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
        ;;

    down|stop)
        CMD="docker-compose stop $SERVICES"
        echo -e "${YELLOW}Executing: $CMD${NC}"
        $CMD
        ;;

    start)
        CMD="docker-compose start $SERVICES"
        echo -e "${YELLOW}Executing: $CMD${NC}"
        $CMD

        echo ""
        sleep 2
        docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
        ;;

    logs)
        CMD="docker-compose logs $OPTIONS $SERVICES"
        echo -e "${YELLOW}Executing: $CMD${NC}"
        echo ""
        $CMD
        ;;

    *)
        echo -e "${RED}Error: Unknown action '$ACTION'${NC}"
        echo "Available actions: build, up, restart, down, logs, stop, start"
        exit 1
        ;;
esac

echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN} Operation completed${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
