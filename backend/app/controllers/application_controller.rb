class ApplicationController < ActionController::API
    def getHistory
        history = History.all
        render json: history
    end
    def getPlayerWins(player)
        history = History.where(player:player)
        return history.map(&:won)
    end
    def createHistory
        logger.debug history_params
        history = History.where(player:history_params[:player])
        id = history.map(&:id)
        history.increment_counter(:won, id)
        render json: history
    end

    def history_params
        params.permit(:player)
    end
end
